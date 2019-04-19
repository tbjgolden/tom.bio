import React, { Component } from 'react';
import Columns from './Columns';
import { routes } from './Header';
import { Link } from 'react-router-dom';
import './Footer.scss';

const blogRoot = (window.location.protocol || 'https:') + '//tbjgolden.com/blog';

class Footer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      blogPosts: []
    };

    window.fetch(`${blogRoot}/posts/index.json`)
      .then(res => res.json())
      .then(blogPosts => {
        if (Array.isArray(blogPosts)) this.setState({ blogPosts });
      })
      .catch(() => {
        console.log('Could not fetch blog post data.');
        this.setState({ blogPosts: null });
      });
  }

  render () {
    const { blogPosts } = this.state;

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
                    .map(({ title, url }) =>
                      <div key={url}>
                        {
                          (url[0] === '/' && url[1] === '/')
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
                              <a href={`${blogRoot}/#/posts/${post.id}`}>
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
                        <a href={blogRoot}>{blogRoot}</a>
                        <br />
                        but I can't get the posts.
                      </div>
                    )
                }
              </div>
              <div>
                <div>About This Site</div>
                <div>This website was written using React.</div>
                <div>There is a lot of fun stuff going on under the surface.</div>
              </div>
              <div>
                <div>Friends</div>
                {
                  [
                    ['Aaron Conway', 'https://aaronconway.co.uk', 'Aaron is an amazing designer'],
                    ['Jamie Mahoney', 'https://mahoneyj2.github.io/', 'Jamie is an amazing programmer']
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
  }
}

export default Footer;
