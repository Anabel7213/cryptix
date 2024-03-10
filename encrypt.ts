export const encrypt = async (text: string) => {
    let encoder = new TextEncoder();
    let data = encoder.encode(text);

    let key = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true, //whether the key is extractable
        ["encrypt", "decrypt"]
    );

    let exportedKey = await crypto.subtle.exportKey("jwk", key);

    let iv = crypto.getRandomValues(new Uint8Array(12));

    let encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        data
    );

    return { 
        encrypted: Array.from(new Uint8Array(encrypted)), // Convert encrypted data to array
        iv: Array.from(iv),
        key: exportedKey,
    };
};

export const decrypt = async ({encryptedData, iv, key}:any) => {
    let encrypted = new Uint8Array(encryptedData).buffer;
    iv = new Uint8Array(iv);

    let cryptoKey = await crypto.subtle.importKey(
        "jwk",
        key,
        { name: "AES-GCM", length: 256 },
        true,
        ["decrypt"]
    );

    try {
        let decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            cryptoKey,
            encrypted
        );
        let decoder = new TextDecoder();
        return decoder.decode(decrypted);
    } catch (e) {
        console.error(e);
        return null;
    }
};
