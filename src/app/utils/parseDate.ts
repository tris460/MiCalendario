/**
   * This function updates a date into YYYY-MM-DD format
   * @param originalDate Date to parse
   * @returns A string with the new date
   */
export function parseDate(originalDate: any) {
  // Parse the original date in a date objet
  const date = new Date(originalDate);

  // Get year, month and date
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Format date "YYYY-MM-DD"
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  return formattedDate;
}
