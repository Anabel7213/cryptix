import { handleDecryption } from "@/decrypt";
import toast from "react-hot-toast";

export const exportToCSV = async ({ allItems }: any) => {
  const csvRows: string[] = [];
  const headers = [
    "Type",
    "Category",
    "Service",
    "Username",
    "Email",
    "Phone",
    "Password",
    "Recovery Phrase",
    "Card Number",
    "CVV",
    "Expiration",
    "PIN",
    "Routing Number",
    "Account Number",
    "Billing Address",
    "ID Number",
    "Additional Info",
    "Issue Date",
    "Expiry Date",
    "Address",
  ];
  csvRows.push(headers.join(","));

  for (const item of allItems) {
    let values: string[] = [];

    if ("Username" in item) {
      const password = await new Promise<string>((resolve) => {
        handleDecryption({
          encryptedData: item.Password,
          setDecryptedData: resolve,
        });
      });

      const recoveryPhrase = await new Promise<string>((resolve) => {
        handleDecryption({
          encryptedData: item["Recovery Phrase"],
          setDecryptedData: resolve,
        });
      });

      values = [
        item.Type,
        item.Category,
        item.Service,
        item.Username,
        item.Email,
        item.Phone,
        password || "",
        recoveryPhrase || "",
        "",
        "",
      ];
    } else if ("CardNumber" in item) {
      const cvv = await new Promise<string>((resolve) => {
        handleDecryption({
          encryptedData: item.CVV,
          setDecryptedData: resolve,
        });
      });
      const pin = await new Promise<string>((resolve) => {
        handleDecryption({
          encryptedData: item.PIN,
          setDecryptedData: resolve,
        });
      });

      values = [
        item.Type,
        "",
        item.Service,
        "",
        "",
        "",
        "",
        "",
        item.CardNumber,
        cvv || "",
        item.Expiration,
        pin || "",
        item.RoutingNumber,
        item.AccountNumber,
        item.BillingAddress,
        "",
      ];
    } else if ("Number" in item) {
      values = [
        item.Type,
        "",
        item.Service,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        item.Number,
        item.AdditionalInfo,
        item.IssueDate,
        item.ExpiryDate,
        item.Address,
      ];
    }

    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "passwords.csv");
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Exported successfully!");
};
