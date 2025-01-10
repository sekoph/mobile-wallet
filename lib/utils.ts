export function encryptId(id: string) {
    return btoa(id);
  }
  
  export function decryptId(id: string) {
    return atob(id);
  }
  
  export function extractCustomerIdFromUrl(url: string) {
    // Split the URL string by '/'
    const parts = url.split("/");
  
    // Extract the last part, which represents the customer ID
    const customerId = parts[parts.length - 1];
  
    return customerId;
  }

  export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

  export const formatDateTime = (dateString: Date) => {
    const dateTimeOptions: Intl.DateTimeFormatOptions = {
      weekday: "short", // abbreviated weekday name (e.g., 'Mon')
      month: "short", // abbreviated month name (e.g., 'Oct')
      day: "numeric", // numeric day of the month (e.g., '25')
      hour: "numeric", // numeric hour (e.g., '8')
      minute: "numeric", // numeric minute (e.g., '30')
      hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    };
  
    const dateDayOptions: Intl.DateTimeFormatOptions = {
      weekday: "short", // abbreviated weekday name (e.g., 'Mon')
      year: "numeric", // numeric year (e.g., '2023')
      month: "2-digit", // abbreviated month name (e.g., 'Oct')
      day: "2-digit", // numeric day of the month (e.g., '25')
    };
  
    const dateOptions: Intl.DateTimeFormatOptions = {
      month: "short", // abbreviated month name (e.g., 'Oct')
      year: "numeric", // numeric year (e.g., '2023')
      day: "numeric", // numeric day of the month (e.g., '25')
    };
  
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric", // numeric hour (e.g., '8')
      minute: "numeric", // numeric minute (e.g., '30')
      hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    };
  
    const formattedDateTime: string = new Date(dateString).toLocaleString(
      "en-US",
      dateTimeOptions
    );
  
    const formattedDateDay: string = new Date(dateString).toLocaleString(
      "en-US",
      dateDayOptions
    );
  
    const formattedDate: string = new Date(dateString).toLocaleString(
      "en-US",
      dateOptions
    );
  
    const formattedTime: string = new Date(dateString).toLocaleString(
      "en-US",
      timeOptions
    );
  
    return {
      dateTime: formattedDateTime,
      dateDay: formattedDateDay,
      dateOnly: formattedDate,
      timeOnly: formattedTime,
    };
  };

  export function formatAmount(amount: number): string {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  
    return formatter.format(amount);
  }

  export const getTransactionStatus = (date: Date) => {
    const today = new Date();
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
  
    return date > twoDaysAgo ? "Processing" : "Success";
  };

  export const removeSpecialCharacters = (value: string) => {
    return value.replace(/[^\w\s]/gi, "");
  };


  // export const getAccountTotalExpenseIncome = (transactions: []) => {
  //     const groupTransactions = transactions.reduce((acc, transaction) => {
  //       const {type} = transaction;
  //       if(!acc)
  //     })
  // }
  
  export const slicedAmount = (expense: number) => {
    const formated = formatAmount(expense)
    const sliced = formated.slice(1,-1);
    return Number(sliced);
  }
