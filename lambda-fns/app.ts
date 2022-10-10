const gremlin = require("gremlin");

const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const Graph = gremlin.structure.Graph;
const uri = process.env.WRITER;

const readAddress =
  "neptunecluster7fc72740-d6dvk93xmuxo.cluster-ro-cvn61ltcvbtn.us-east-1.neptune.amazonaws.com:8182";
const writeAddress =
  "neptunecluster7fc72740-d6dvk93xmuxo.cluster-cvn61ltcvbtn.us-east-1.neptune.amazonaws.com:8182";

let dcWrite = new DriverRemoteConnection(`wss://${writeAddress}/gremlin`, {});
const graphWrite = new Graph();
const gWrite = graphWrite.traversal().withRemote(dcWrite);

const main = async () => {
  const res = await gWrite
    .addV("user")
    .property("title", "test title")
    .property("content", "test content")
    .next();

  console.log(res);
  dcWrite.close();
};

main().catch(console.error);
