"use client";

interface Props {
  image: {
    preview: string;
    file: File | null;
  };

  metadata: string;
  score: number;
}


export default function ShelbyUploadInspector({
  image,
  metadata,
  score,
}: Props) {


  const metadataValid =
    metadata.length > 0;


  return (

    <div className="rounded-2xl border bg-white p-6 shadow-lg">

      <h2 className="text-xl font-bold text-blue-700">
        🚀 Shelby Upload Inspector
      </h2>


      <p className="mt-2 text-sm text-gray-500">
        Final verification before uploading your NFT asset.
      </p>



      <div className="mt-6 space-y-4">


        <div className="flex justify-between border-b pb-3">

          <span>
            Asset
          </span>

          <span className="font-semibold">
            {image.file
              ? image.file.name
              : "No asset uploaded"
            }
          </span>

        </div>



        <div className="flex justify-between border-b pb-3">

          <span>
            Metadata
          </span>

          <span>
            {metadataValid
              ? "✅ Valid"
              : "❌ Missing"
            }
          </span>

        </div>



        <div className="flex justify-between border-b pb-3">

          <span>
            Readiness Score
          </span>

          <span className="font-bold">
            {score}/100
          </span>

        </div>



        <div className="rounded-lg bg-green-50 p-4 text-green-700">

          {image.file && metadataValid && score >= 75
            ? "✅ Ready for Shelby upload"
            : "⚠️ Complete requirements before upload"
          }

        </div>


      </div>

    </div>

  );
}