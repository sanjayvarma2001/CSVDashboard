const BASE_URL = "http://127.0.0.1:8000"

export const api ={
    checkHealth: async() => {
        const res = await fetch(`${BASE_URL}/health`);
        if (!res.ok) throw new Error("Backend offline");
        return res.json();
    },

    getRecentReports: async() => {
        const res = await fetch(`${BASE_URL}/reports/recent`);
        if (!res.ok) throw new Error("Failed to fetch history");
        return res.json();
    },

    getReportById: async (id: number) => {
        const res = await fetch(`${BASE_URL}/reports/${id}`);
        if(!res.ok) throw new Error("Failed to load report");
        return res.json();
    },

    uploadCSV: async (file: File) => {
        const formData = new FormData();
        formData.append("file",file);

        const res = await fetch(`${BASE_URL}/upload`,{
            method:"POST",
            body: formData,
        });
        if (!res.ok) throw new Error("Upload Failed");
        return res.json();
    },

    sendChatMessage: async (reportId: number, message: string) => {
        const res = await fetch(`${BASE_URL}/reports/${reportId}/chat`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({message}),
        })
        if (!res.ok) throw new Error("Chat failed");
        return res.json();
    }
}