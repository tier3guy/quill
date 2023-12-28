import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Expand, Loader2 } from "lucide-react";
import { Page, Document } from "react-pdf";
import SimpleBar from "simplebar-react";
import { useToast } from "../ui/use-toast";
import { useResizeDetector } from "react-resize-detector";

const PdfFullscreen = ({ url }: { url: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const [numberOfPages, setNumberOfPages] = useState<number>();

  const { width, ref } = useResizeDetector();

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
        <Button
          className="gap-1.5"
          variant={"ghost"}
          aria-label="fullscreen"
          onClick={() => setIsOpen(true)}
        >
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl md:max-w-6xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-6rem)] mt-6">
          <div ref={ref}>
            <Document
              file={url}
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: "Error Loading PDF",
                  description: "Please try again later",
                  variant: "destructive",
                });
              }}
              onLoadSuccess={({ numPages }) => {
                setNumberOfPages(numPages);
              }}
            >
              {new Array(numberOfPages).fill(0).map((_, i) => (
                <Page key={i} pageNumber={i + 1} width={width ? width : 1} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullscreen;
