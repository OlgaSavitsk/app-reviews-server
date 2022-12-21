import * as bcrypt from 'bcrypt';

export const getHashData = (data: string): Promise<string> => {
  return bcrypt.hash(data, +process.env.CRYPT_SALT);
};

export const comparePassword = async (
  password: string,
  existsPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, existsPassword);
};
