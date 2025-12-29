export function validateFileSize(file, setError) {
    if (!file) return false;
  
    const sizeKB = file.size / 1024;
  
    if (sizeKB < 100 || sizeKB > 200) {
      setError("File size exceeded");
      return false;
    }
  
    setError("");
    return true;
  }
  