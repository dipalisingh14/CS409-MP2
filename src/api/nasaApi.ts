import axios from 'axios';

const NASA_API_KEY = 'DXV8mQt7cSSJomkRJqHUjpt14Xe5Z1SvQxolLUG4';

export const fetchNasaApod = async (
  date?: string,
  conceptTags: boolean = false,
  startDate?: string,
  endDate?: string
) => {
  let url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

  // If a single date is provided
  if (date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }
    url += `&date=${date}`;
  }

  // If a range is provided
  if (startDate && endDate) {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }

  if (conceptTags) {
    url += `&concept_tags=true`;
  }

  try {
    const response = await axios.get(url);
    return response.data; // Axios automatically parses JSON
  } catch (error: any) {
    throw new Error(`Failed to fetch NASA APOD: ${error.message}`);
  }
};
