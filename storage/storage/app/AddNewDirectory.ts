const addNewDirectory = async (
  name: string,
  directory: string,
  role: "user" | "admin"
) => {
  console.log(name);
  console.log(directory);
  return await (
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        role: role,
      },
      body: JSON.stringify({ name, directory }),
    })
  ).json();
};

export default addNewDirectory;
