const HOST = `https://llm.nangua203.com`;

export const getApps = () => {
    return fetch(`${HOST}/v1/apps?workspace_id=924c0536-3253-4607-897a-f8e2e638bd73&sign=f58bfa53930513c971cc2c6a1f3a6fd4&page=1&limit=30&mode=all`, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());
}