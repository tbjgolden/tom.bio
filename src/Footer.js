import React, { useState, useEffect, useContext } from 'react';
import Columns from './Columns';
import RoutesContext from "./RoutesContext";
import { Link } from 'react-router-dom';
import './Footer.scss';

const blogUrl = `${process.env.PUBLIC_URL}/blog`;

const Footer = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const routes = useContext(RoutesContext);

  useEffect(() => {
    window.fetch(`${blogUrl}/posts/index.json`)
      .then(res => res.json())
      .then(blogPosts => {
        if (Array.isArray(blogPosts)) setBlogPosts(blogPosts);
      })
      .catch(() => {
        console.log('Could not fetch blog post data.');
        setBlogPosts(null);
      });
  }, []);

  return (
    <footer className='Footer'>
      <div className='App-row-sizer'>
        <div className='Footer-top'>
          <Columns>
            <div>
              <div>Pages</div>
              <div><Link to='/'>Home</Link></div>
              {
                routes
                  .map(({ title, url, external }) =>
                    <div key={url}>
                      {
                        external
                          ? <a href={url} alt={title}>{title}</a>
                          : <Link to={url}>{title}</Link>
                      }
                    </div>
                  )
              }
            </div>
            <div>
              <div>Recent Posts</div>
              {
                blogPosts
                  ? (
                    blogPosts.length
                      ? (
                        blogPosts.reverse().slice(0, Math.min(blogPosts.length, 2)).map(post =>
                          <div key={post.id}>
                            <a href={`${blogUrl}/posts/${post.id}`}>
                              {`${post.title} – ${new Date(post.timestamp).toLocaleDateString()}`}
                            </a>
                          </div>
                        )
                      )
                      : <div>Loading...</div>
                  )
                  : (
                    <div>
                      There should be a blog at
                      <br />
                      <a href={blogUrl}>{blogUrl}</a>
                      <br />
                      but I can't get the posts.
                    </div>
                  )
              }
            </div>
            <div>
              <div>About This Site</div>
              <div>React, SCSS, Canvas API, Hooks, Custom HOCs, Custom CMS, Mostly Accessible</div>
              <div>
                <a
                  href='https://github.com/tom/tbjgolden.github.io'
                  target='_blank' rel='noopener noreferrer'
                >
                  See the source code
                </a>
              </div>
            </div>
            <div>
              <div>Friends</div>
              {
                [
                  ['Aaron Conway', 'https://aaronconway.co.uk', 'Aaron is an amazing designer'],
                  ['Jamie Mahoney', 'https://mahoneyj2.github.io', 'Jamie is an amazing programmer']
                ].map(([text, address, description]) => (
                  <div key={text}>
                    <div>
                      <a href={address} target='_blank' rel='noopener noreferrer'>
                        {text}
                      </a>
                    </div>
                    <div>
                      {description}
                    </div>
                  </div>
                ))
              }
            </div>
            <div>
              <div>Disclaimer</div>
              <div>
                This website's design is entirely satirical and not to be taken too literally.
              </div>
            </div>
          </Columns>
        </div>
        <small>
          Copyright &copy; {(new Date()).getFullYear()} TomGolden. All rights reserved.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
