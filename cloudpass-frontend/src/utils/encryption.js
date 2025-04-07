import CryptoJS from 'crypto-js';

// 使用主密钥加密密码
export const encryptPassword = (password, masterKey) => {
  return CryptoJS.AES.encrypt(password, masterKey).toString();
};

// 使用主密钥解密密码
export const decryptPassword = (encryptedPassword, masterKey) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, masterKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// 生成主密钥
export const generateMasterKey = (username, password) => {
  return CryptoJS.PBKDF2(password, username, {
    keySize: 256 / 32,
    iterations: 1000
  }).toString();
};

// 加密整个密码对象
export const encryptPasswordObject = (passwordObj, masterKey) => {
  const encryptedPassword = encryptPassword(passwordObj.password, masterKey);
  return {
    ...passwordObj,
    password: encryptedPassword
  };
};

// 解密整个密码对象
export const decryptPasswordObject = (encryptedObj, masterKey) => {
  if (!encryptedObj || !masterKey) return null;

  try {
    const decryptedPassword = decryptPassword(encryptedObj.password, masterKey);
    return {
      ...encryptedObj,
      password: decryptedPassword
    };
  } catch (error) {
    console.error('解密失败:', error);
    return null;
  }
};