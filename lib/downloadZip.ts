import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function downloadZip(files: object[]) {
  const zip = new JSZip();

  files.forEach((file, index) => {
    zip.file(
      `${String(index + 1).padStart(4, "0")}.json`,
      JSON.stringify(file, null, 2)
    );
  });

  const blob = await zip.generateAsync({
    type: "blob",
  });

  saveAs(blob, "metadata.zip");
}