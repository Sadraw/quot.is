// heapdumpModule.js
// ...
function captureHeapSnapshot(filename) {
  const filePath = `./snapshots/${filename}`; // Use the snapshots folder
  heapdump.writeSnapshot(filePath, (err, snapshotFilename) => {
    if (err) {
      console.error("Error capturing heap snapshot:", err);
    } else {
      console.log("Heap snapshot captured:", snapshotFilename);
    }
  });
}
// ...
