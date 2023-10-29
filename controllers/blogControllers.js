import axios from "axios";
import lodash from "lodash";
import memoize from "lodash.memoize";
const cacheDuration = 60000;
const memoizedFetchBlogs = memoize(
  async () => {
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
      return response.data.blogs;
    } catch (error) {
      return error.response;
    }
  },
  undefined,
  cacheDuration
);

const getBlogStats = async (req, res) => {
  try {
    const blogs = await memoizedFetchBlogs();

    if (blogs.status === 404) {
      throw { status: blogs.status, message: "Data not fetched" };
    }

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
      "Total no. of blogs": totalBlogs,
      "Longest title": longestTitleBlog.title,
      "No. of blogs with private in title": privacyBlogs.length,
      "No. of Unique titles": uniqueTitles,
    });
  } catch (error) {
    let message = error;
    if (error.message) {
      message = error.message;
    }
    res.status(error.status || 500).json({ error: message });
  }
};

const blogSearch = async (req, res) => {
  try {
    if (!req.query.query) {
      throw "Value in query parameter is required.";
    }

    const query = req.query.query.toLowerCase();
    const blogs = await memoizedFetchBlogs();

    if (blogs.status === 404) {
      throw { message: { status: blogs.status, message: "Data not fetched" } };
    }

    const privacyBlogs = lodash.filter(blogs, (blog) =>
      blog.title.toLowerCase().includes(query)
    );

    res.json(privacyBlogs);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export { getBlogStats, blogSearch };
