const downloadFile = async (id: string, role: "user" | "admin") => {
  return await (
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file-download?id=${id}`, {
      method: "GET",
      headers: {
        role: role,
      },
    })
  ).json();
};

export default downloadFile;
