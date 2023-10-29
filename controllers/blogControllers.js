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
      throw { status: blogs.status, message: "Error in fetching data" };
    }

    const totalBlogs = blogs.length;
    const search_string = "privacy";
    const longestTitleBlog =
      totalBlogs > 0 ? lodash.maxBy(blogs, (blog) => blog.title.length) : null;

    const privacyBlogs =
      totalBlogs > 0
        ? lodash.filter(blogs, (blog) =>
            blog.title.toLowerCase().includes(search_string)
          )
        : [];

    const uniqueTitles =
      totalBlogs > 0
        ? lodash.uniqBy(blogs, "title").map((blog) => blog.title)
        : [];

    res.json({
      "Total no. of blogs": totalBlogs,
      "Longest title": longestTitleBlog ? longestTitleBlog.title : "No blogs found",
      "No. of blogs with 'privacy' in title": privacyBlogs.length,
      "List of Unique titles": {Total: uniqueTitles.length, Titles: uniqueTitles},
    });
  } catch (error) {
    let message = error;
    if (error.message) {
      message = error.message;
    }
    res.status(error.status || 500).json({ error: message });
  }
};

const searchBlogs = async (req, res) => {
  try {
    if (!req.query.query) {
      throw "A value in the query parameter is required.";
    }

    const query = req.query.query.toLowerCase();
    const blogs = await memoizedFetchBlogs();

    if (blogs.status === 404) {
      throw { status: blogs.status, message: "Error in fetching data" };
    }

    const filteredBlogs = lodash.filter(blogs, (blog) =>
      blog.title.toLowerCase().includes(query)
    );

    if (!filteredBlogs.length) {
      res
        .status(404)
        .json({ message: "No blogs were found for the searched word." });
    } else {
      res.json(filteredBlogs);
    }
  } catch (error) {
    let message = error;
    if (error.message) {
      message = error.message;
    }
    res.status(error.status || 500).json({ error: message });
  }
};

export { getBlogStats, searchBlogs };
