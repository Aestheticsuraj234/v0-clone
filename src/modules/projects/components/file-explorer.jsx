import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState, useMemo, useCallback, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { CodeView } from "./code-view";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "./tree-view";
import { Hint } from "@/components/ui/hint";

const FileBreadcrumb = ({ filePath }) => {
  const pathSegments = filePath.split("/");
  const maxSegments = 4;

  const renderBreadCrumItems = () => {
    if (pathSegments.length <= maxSegments) {
      return pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;

        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage>{segment}</BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground+">{segment}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    } else {
      const firstSegment = pathSegments[0];
      const lastSegment = pathSegments[pathSegments.length - 1];

      return (
        <>
          <BreadcrumbItem>
            <span className="text-muted-foreground">{firstSegment}</span>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="font-medium">
              {lastSegment}
            </BreadcrumbItem>
          </BreadcrumbItem>
        </>
      );
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadCrumItems()}</BreadcrumbList>
    </Breadcrumb>
  );
};

function getLanguageFromExtension(filename) {
  const extension = filename.split(".").pop()?.toLowerCase();

  const languageMap = {
    js: "javascript",
    jsx: "jsx",
    ts: "typescript",
    tsx: "tsx",
    py: "python",
    html: "html",
    css: "css",
    json: "json",
    md: "markdown",
  };

  return languageMap[extension] || "text";
}

export const FileExplorer = ({ files }) => {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback(
    (filePath) => {
      if (files[filePath]) {
        setSelectedFile(filePath);
      }
    },
    [files]
  );
  const handleCopy = useCallback(() => {
    if (selectedFile && files[selectedFile]) {
      navigator.clipboard
        .writeText(files[selectedFile])
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((error) => {
          console.error("Failed to copy:", error);
        });
    }
  }, [selectedFile, files]);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel
        defaultSize={25}
        minSize={20}
        maxSize={40}
        className="bg-sidebar"
      >
        <div className="h-full overflow-auto">
          <TreeView
            data={treeData}
            value={selectedFile}
            onSelect={handleFileSelect}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle className="w-1.5 hover:bg-primary/20 transition-colors" />

      <ResizablePanel defaultSize={75} minSize={40}>
        {selectedFile && files[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar/50 px-4 py-2 flex justify-between items-center gap-x-2">
              <FileBreadcrumb filePath={selectedFile} />
              <Hint label="Copy to clipboard" side="bottom" sideOffset={4}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-background/80"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <CopyCheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-auto relative">
              <CodeView
                code={files[selectedFile]}
                lang={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p className="text-sm">Select a file to view its content</p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
