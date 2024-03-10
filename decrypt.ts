import { decrypt } from "./encrypt";

export const decryptData = async ({ encrypted, iv, key }: any) => {
    if (!encrypted || !iv || !key) {
        console.error("Missing encryption data");
        return null;
    }

    const encryptedArray = new Uint8Array(encrypted);
    const ivArray = new Uint8Array(iv);

    try {
        const decryptedData = await decrypt({
            encryptedData: encryptedArray, 
            iv: ivArray,
            key: key
        });
        return decryptedData;
    } catch (error) {
        console.error("Error decrypting data:", error);
        return null;
    }
};

export const handleDecryption = async ({encryptedData, setDecryptedData}: any) => {
    const decryptedData = await decryptData(encryptedData)
    setDecryptedData(decryptedData)
}