import { capitalize } from '../utils';

const prismaTemplate = (singular: string) => `\
model ${capitalize(singular)} {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  createdAt DateTime @default(now())
}
`;

export default prismaTemplate;
