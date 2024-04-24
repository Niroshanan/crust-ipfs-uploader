"use client";
import { useRef } from "react";
import { handleAdd } from "./helpers/fileUploader";
import { base64ToFile } from "./helpers/base64ToImage";
import { crustPin } from "./helpers/crustPin";

export default function Home() {
  const inputFile = useRef<HTMLInputElement>(null);
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    const fileInput = inputFile.current;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileReader = new FileReader();

      // Read file as text
      fileReader.readAsText(file);
      fileReader.onload = async () => {
        const data = JSON.parse(fileReader.result as string);
        const base64String = data.credentialSubject.issuerLogo;
        const imgFile = base64ToFile(base64String, "issuerLogo.png");
        await handleAdd(file, imgFile);
      };

      fileReader.onerror = () => {
        console.error("Error reading file");
      };
    } else {
      console.error("No file selected");
    }
  };

  const handlePin = async () => {
    const cid = document.getElementById("cid") as HTMLInputElement;
    if (cid) {
      const cidString = cid.value;
      const res = await crustPin(cidString);
      console.log(res);
    } else {
      console.error("No CID provided");
    }
  };
  return (
    <main>
      <div className="container flex flex-row gap-3 pr-5">
        <form id="jsonUploadForm" onSubmit={handleFileUpload}>
          <input
            type="file"
            id="jsonFileInput"
            accept=".json"
            ref={inputFile}
            required
          />
          <button type="submit">Upload</button>
        </form>
        <div id="image">
          <input type="text" id="cid" name="cid" required />
          <button onClick={handlePin}>pin </button>
        </div>
      </div>
    </main>
  );
}
