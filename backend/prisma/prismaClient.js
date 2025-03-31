import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async create({ args, query }) {
        if (args.data?.password) {
          args.data.password = await bcrypt.hash(args.data.password, 10);
        }
        return query(args);
      },
      async update({ args, query }) {
        if (args.data?.password) {
          args.data.password = await bcrypt.hash(args.data.password, 10);
        }
        return query(args);
      },
      async upsert({ args, query }) {
        if (args.create?.password) {
          args.create.password = await bcrypt.hash(args.create.password, 10);
        }
        if (args.update?.password) {
          args.update.password = await bcrypt.hash(args.update.password, 10);
        }
        return query(args);
      },
    },
  },
});

export default prisma;
