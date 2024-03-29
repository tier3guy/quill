"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import Dropzone from "react-dropzone";
import { Cloud, File, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Progress } from "../ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "../ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

const UploadButton = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <UploadDropzone isSubscribed={isSubscribed} />
      </DialogContent>
    </Dialog>
  );
};

const UploadDropzone = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { startUpload } = useUploadThing(
    isSubscribed ? "proPdfUploader" : "freePdfUploader"
  );
  const { toast } = useToast();
  const router = useRouter();

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev < 95) return prev + 5;
        else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 500);

    return interval;
  };

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file?.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <Dropzone
      multiple={false}
      onDrop={async (file) => {
        setIsUploading(true);
        const progressInterval = startSimulatedProgress();

        const res = await startUpload(file);

        console.log(res);

        if (!res) {
          return toast({
            title: "Something went wrong.",
            description: "Please try again later.",
            variant: "destructive",
          });
        }

        const [fileResponse] = res;
        const fileKey = fileResponse.key;

        console.log(fileKey);

        if (!fileKey) {
          return toast({
            title: "Something went wrong.",
            description: "Please try again later.",
            variant: "destructive",
          });
        }

        clearInterval(progressInterval);
        setUploadProgress(100);

        startPolling({ key: fileKey });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">
                  PDF (up to {isSubscribed ? "16" : "4"}MB)
                </p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="mt-4 w-full mx-auto max-w-xs">
                  <Progress
                    value={uploadProgress}
                    className="h-1 bg-zinc-200"
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Redirecting...
                    </div>
                  ) : null}
                </div>
              ) : null}
            </label>

            <input
              {...getInputProps()}
              type="file"
              id="dropzone-file"
              className="hidden"
            />
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default UploadButton;
