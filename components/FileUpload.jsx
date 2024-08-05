'use client';

import toast from 'react-hot-toast';

import { UploadDropzone } from '@/lib/uploadThing';

const FileUpload = ({ onChange, endpoint }) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error) => {
        toast.error(`${error?.message}`);
      }}
    />
  );
};

export default FileUpload;
