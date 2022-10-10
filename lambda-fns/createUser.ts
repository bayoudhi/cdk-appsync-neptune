import { driver, structure } from "gremlin";
import User from "./User";

const DriverRemoteConnection = driver.DriverRemoteConnection;
const Graph = structure.Graph;
const uri = process.env.WRITER;

async function createUser(user: User) {
  let dc = new DriverRemoteConnection(`wss://${uri}/gremlin`, {});
  const graph = new Graph();
  const g = graph.traversal().withRemote(dc);

  const res = await g.addV("user").property("name", user.name).next();
  console.log(res);
  dc.close();
  return {
    ...user,
    id: res.value.id,
  };
}
export default createUser;
