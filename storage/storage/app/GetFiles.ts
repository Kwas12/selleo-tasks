const getFiles = async (directory: string, role: "user" | "admin") => {
  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/files?directory=${directory}`,
      {
        method: "GET",
        headers: {
          role: role,
        },
      }
    )
  ).json();
};

export default getFiles;
