import createUser from "./createUser";
import listUsers from "./listUsers";
import User from "./User";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    user: User;
  };
};

exports.handler = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case "createUser":
      return await createUser(event.arguments.user);
    case "listUsers":
      return await listUsers();
    default:
      return null;
  }
};
