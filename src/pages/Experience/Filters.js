import React, { Component } from 'react';
import Columns from '../../Columns';
import Period from './Period';
import xpList, { tags } from './data.js'
import './Filters.scss';

class Filters extends Component {
  tagTree = new TagTree(tags);

  state = { loadingIndicatorShown: false };

  onButtonClick = tag => {
    tag.toggle();
    this.forceUpdate();
    this.setState({ loadingIndicatorShown: true });
    setTimeout(() => {
      this.setState({ loadingIndicatorShown: false })
    }, 250);
  };

  render = () => {
    const { tagTree, state } = this;
    const { loadingIndicatorShown } = state;
    const activeTags = tagTree.activeTags;

    const filterFunction = xpItem => {
      if (!activeTags.length) return true;
      return activeTags.every(({ tag }) => xpItem.tags.includes(tag));
    };

    const filteredList = xpList.reduce((list, xpItem) => {
      const { title, headerLines, paragraphs, beginMonth, beginYear, endMonth, endYear } = xpItem;
      const periodDates = {
        beginMonth,
        beginYear,
        ...(endMonth ? { endMonth, endYear } : {})
      };

      if (filterFunction(xpItem)) {
        list.push(
          <div key={title} className='App-row Experience-block white'>
            <div className='App-row-sizer'>
              <Columns>
                <div>
                  <div className='App-row-title'>{title}</div>
                  <Period {...periodDates} />
                </div>
                <div>
                  <div className='App-row-header'>
                    {headerLines.join('\n')}
                  </div>
                  <div className='App-row-description'>
                    {paragraphs.join('\n\n')}
                  </div>
                </div>
              </Columns>
            </div>
          </div>
        );
      }

      return list;
    }, []);

    return (
      <div className='Filters'>
        <div className='App-row white'>
          <div className='App-row-sizer'>
            {
              tagTree.root.children.map(({ categoryName, children }) => (
                <div key={categoryName} className='tag-group'>
                  <div className='tag-group-name'>{categoryName}</div>
                  {
                    children.map(tagObj => {
                      const { tag, tagName, active, children } = tagObj;
                      return (
                        <div key={tag} className={`tag-container ${active ? 'active' : ''} ${children ? 'has-children' : ''}`}>
                          <button
                            name={tag}
                            className='tag'
                            onClick={() => this.onButtonClick(tagObj)}
                          >
                            {tagName}
                          </button>

                          {
                            children
                              ? (
                                <div className='tag-children'>
                                  {
                                    children.map(tagObj => {
                                      const { tag, tagName, active, children } = tagObj;
                                      return (
                                        <div key={tag} className={`tag-container ${active ? 'active' : ''} ${children ? 'has-children' : ''}`}>
                                          <button
                                            name={tag}
                                            className='tag'
                                            onClick={() => this.onButtonClick(tagObj)}
                                          >
                                            {tagName}
                                          </button>
                                        </div>
                                      );
                                    })
                                  }
                                </div>
                              )
                              : null
                          }
                        </div>
                      );
                    })
                  }
                </div>
              ))
            }
          </div>
        </div>

        {
          loadingIndicatorShown
            ? (
              <div className='App-row white'>
                <div className='App-row-sizer'>
                  <div className='App-row-header'>
                    <img alt='Loading...' src='images/loading.gif' style={{ width: '2.5ex' }} />
                  </div>
                </div>
              </div>
            )
            : (
              filteredList.length
                ? filteredList
                : (
                  <div className='App-row white'>
                    <div className='App-row-sizer'>
                      <div className='App-row-header'>
                        The selected combination of filters has no matches.
                      </div>
                    </div>
                  </div>
                )
            )
        }
      </div>
    );
  };
}

class TagTree {
  constructor (deepList) {
    this.root = { children: this._parseDeepList(deepList) };
  }

  get activeTags () {
    const activeTags = [];

    this._DFS(
      node => {
        if (node.parent && node.active) {
          activeTags.push(node);
        }
      }
    );

    return activeTags;
  }

  _DFS (fn, state = {}, node = this.root) {
    fn(node, state);
    if (node.children) {
      node.children.forEach(child => this._DFS(fn, state, child));
    }
    return state;
  }

  _parseDeepList (list) {
    const parsedList = [];

    for (let i = 0; i < list.length; i++) {
      const [ categoryName, children ] = list[i];

      const node = { categoryName };
      node.children = this._parseChildren(children, node);

      parsedList.push(node);
    }

    return parsedList;
  }

  _parseChildren (list, parent) {
    const parsedChildren = [];
    const _this = this;

    for (let i = 0; i < list.length; i++) {
      const [ tag, tagName, children ] = list[i];

      const node = {
        tagName,
        tag,
        parent,
        active: false,
        toggle: function () {
          this.parent.children.forEach(child => {
            if (child === this) {
              child.active = !child.active;
            } else {
              child.active = false;
            }
            _this._DFS(
              node => {
                if (node !== child) {
                  node.active = false;
                }
              },
              {},
              child
            );
          });
        }
      };

      if (children) {
        node.children = this._parseChildren(children, node);
      }

      parsedChildren.push(node);
    }

    return parsedChildren;
  }
}

export default Filters;
