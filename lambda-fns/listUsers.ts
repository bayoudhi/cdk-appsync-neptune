const gremlin = require("gremlin");

const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const Graph = gremlin.structure.Graph;
const uri = process.env.READER;

const listUsers = async () => {
  let dc = new DriverRemoteConnection(`wss://${uri}/gremlin`, {});
  const graph = new Graph();
  const g = graph.traversal().withRemote(dc);

  let data = await g.V().hasLabel("user").toList();
  console.log(JSON.stringify(data, null, 2));
  let posts = Array();

  for (const v of data) {
    const _properties = await g.V(v.id).properties().toList();
    let post = _properties.reduce((acc, next) => {
      acc[next.label] = next.value;
      return acc;
    }, {});
    post.id = v.id;
    posts.push(post);
  }

  dc.close();
  return posts;
};

export default listUsers;
