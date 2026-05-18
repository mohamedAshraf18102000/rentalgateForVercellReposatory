import { useQuery } from "@tanstack/react-query";

const TEST_URL =
    "https://hajj.alghazal.info/api/reports/dashboard-overview";

const fetchTestCars = async () => {
    const res = await fetch(TEST_URL, {
        headers: {
            authorization: `Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhJZCI6MywiZW1haWwiOiJhZG1pbkByZW50YWxnYXRlLmNvbSIsImVudGl0eVR5cGUiOiJVU0VSIiwiaWF0IjoxNzc5MDk0Mjg4LCJleHAiOjE3ODE2ODYyODh9.ZbHsrDNKM1hNJDrLBtbtxqas_M1qgs6kdmZc1MP2x9KU94Y5qHMCHJpY2-tjCxi2`,
        }
    });

    if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
    }

    return res.json();
};

export const useTest = () =>
    useQuery({
        queryKey: ["test-cars"],
        queryFn: fetchTestCars,
    });
