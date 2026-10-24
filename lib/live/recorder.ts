import fixWebmDuration from "fix-webm-duration";

/**
 * Records what the host is sending, in the host's own browser, so a stream
 * can be saved to Shelby afterwards. Nothing is recorded on a server.
 *
 * A recording is cut into parts: a new part starts when the picture source
 * changes (camera <-> screen) and every 30 minutes, which keeps each file a
 * sensible size and each part a complete, playable video.
 */

export const PART_MAX_MS = 30 * 60 * 1000;

const MIN_PART_MS = 3_000;

const MIN_PART_BYTES = 100 * 1024;

/** Duration fixing reads the whole file into memory, so very large parts are left as they are. */
const FIX_DURATION_MAX_BYTES = 450 * 1024 * 1024;

export interface RecordedPart {
  blob: Blob;
  durationMs: number;
  startedAt: number;
}

export function supportedRecordingType(): string | null {
  if (typeof MediaRecorder === "undefined") return null;

  const options = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];

  return options.find((type) => MediaRecorder.isTypeSupported(type)) ?? null;
}

export class ReplayRecorder {
  private mime: string;
  private onPart: (part: RecordedPart) => void;
  private recorder: MediaRecorder | null = null;
  private context: AudioContext | null = null;
  private chunks: Blob[] = [];
  private startedAt = 0;
  private key = "";
  private timer: ReturnType<typeof setTimeout> | null = null;
  private queue: Promise<void> = Promise.resolve();
  private stopped = false;
  private last: { video: MediaStreamTrack | null; audio: MediaStreamTrack[] } = { video: null, audio: [] };

  constructor(mime: string, onPart: (part: RecordedPart) => void) {
    this.mime = mime;
    this.onPart = onPart;
  }

  /** Call whenever the host's tracks may have changed. Starts, keeps or restarts recording. */
  update(video: MediaStreamTrack | null, audio: MediaStreamTrack[]): void {
    this.last = { video, audio };

    this.queue = this.queue.then(() => this.apply(video, audio)).catch(() => {});
  }

  /** Finishes the current part. Safe to call more than once. */
  async stop(): Promise<void> {
    this.stopped = true;

    this.queue = this.queue.then(() => this.finishSegment()).catch(() => {});

    await this.queue;
  }

  private async apply(video: MediaStreamTrack | null, audio: MediaStreamTrack[]) {
    if (this.stopped) return;

    const liveVideo = video && video.readyState === "live" ? video : null;

    const liveAudio = audio.filter((track) => track.readyState === "live");

    // Camera briefly off: keep the running part going rather than cutting a new one.
    if (!liveVideo && this.recorder) return;

    const key = [liveVideo?.id ?? "", ...liveAudio.map((track) => track.id)].join("|");

    if (this.recorder && key === this.key) return;

    if (!liveVideo && liveAudio.length === 0) return;

    await this.finishSegment();

    this.startSegment(liveVideo, liveAudio, key);
  }

  private startSegment(video: MediaStreamTrack | null, audio: MediaStreamTrack[], key: string) {
    const tracks: MediaStreamTrack[] = [];

    if (video) tracks.push(video);

    if (audio.length > 0) {
      try {
        const context = new AudioContext();

        const destination = context.createMediaStreamDestination();

        for (const track of audio) {
          context.createMediaStreamSource(new MediaStream([track])).connect(destination);
        }

        void context.resume();

        this.context = context;

        tracks.push(...destination.stream.getAudioTracks());
      } catch {
        // No sound in the replay if the browser cannot mix audio; the picture is still saved.
      }
    }

    if (tracks.length === 0) return;

    const recorder = new MediaRecorder(new MediaStream(tracks), {
      mimeType: this.mime,
      videoBitsPerSecond: 1_500_000,
      audioBitsPerSecond: 96_000,
    });

    this.chunks = [];

    this.startedAt = Date.now();

    this.key = key;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) this.chunks.push(event.data);
    };

    recorder.start(10_000);

    this.recorder = recorder;

    this.timer = setTimeout(() => {
      // Cut a new part so files stay a reasonable size.
      this.key = "";
      this.queue = this.queue
        .then(() => this.finishSegment())
        .then(() => this.apply(this.last.video, this.last.audio))
        .catch(() => {});
    }, PART_MAX_MS);
  }

  private finishSegment(): Promise<void> {
    const recorder = this.recorder;

    if (this.timer) clearTimeout(this.timer);

    this.timer = null;

    if (!recorder) return Promise.resolve();

    this.recorder = null;

    const context = this.context;

    this.context = null;

    const startedAt = this.startedAt;

    return new Promise<void>((resolve) => {
      const done = () => {
        void context?.close().catch(() => {});

        const durationMs = Date.now() - startedAt;

        const blob = new Blob(this.chunks, { type: "video/webm" });

        this.chunks = [];

        if (blob.size < MIN_PART_BYTES || durationMs < MIN_PART_MS) {
          resolve();
          return;
        }

        const publish = (finalBlob: Blob) => {
          this.onPart({ blob: finalBlob, durationMs, startedAt });
          resolve();
        };

        if (blob.size > FIX_DURATION_MAX_BYTES) {
          publish(blob);
          return;
        }

        // MediaRecorder files have no length, which breaks the seek bar. Add it.
        fixWebmDuration(blob, durationMs, { logger: false })
          .then(publish)
          .catch(() => publish(blob));
      };

      if (recorder.state === "inactive") {
        done();
        return;
      }

      recorder.onstop = done;

      try {
        recorder.stop();
      } catch {
        done();
      }
    });
  }
}
