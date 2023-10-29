import axios from "axios";
import lodash from "lodash";

const getBlogStats = async (req, res) => {
  try {
    const response = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      {
        headers: {
          "x-hasura-admin-secret":
            "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
        },
      }
    );

    const blogs = response.data.blogs;
    const totalBlogs = blogs.length;
    const search_string = "privacy";
    const longestTitleBlog = lodash.maxBy(blogs, (blog) => blog.title.length);
    const privacyBlogs = lodash.filter(blogs, (blog) =>
      blog.title.toLowerCase().includes(search_string)
    );
    const uniqueTitles = lodash
      .uniqBy(blogs, "title")
      .map((blog) => blog.title);
    res.json({
      totalBlogs,
      longestTitle: longestTitleBlog.title,
      privacyBlogs: privacyBlogs.length,
      uniqueTitles,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const blogSearch = async (req, res) => {
  const query = req.query.search_string.toLowerCase();

  if (!query) {
    return res
      .status(400)
      .json({ error: 'Query parameter "query" is required.' });
  }

  try {
    const response = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      axiosConfig
    );

    const blogs = response.data.blogs;
    const privacyBlogs = lodash.filter(blogs, (blog) =>
      blog.title.toLowerCase().includes(query)
    );

    res.json(privacyBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getBlogStats, blogSearch };
