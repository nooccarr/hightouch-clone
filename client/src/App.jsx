import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Axios from 'axios';
import Styled from 'styled-components';

import TopBar from './components/TopBar';
import SidebarNavigation from './components/SidebarNavigation';
import MainContentWelcome from './components/MainContentWelcome';
import MainContentOther from './components/MainContentOther';

const App = () => {
  const [navItemList, setNavItemList] = useState([]);
  const [navItems, setNavItems] = useState({});
  const [mainContentItem, setMainContentItem] = useState(null);
  const [mainContentHeadings, setMainContentHeadings] = useState({});
  const [diveDeeperCards, setDiveDeeperCards] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    getSidebarNavMainContentData();
  }, []);

  const getSidebarNavMainContentData = () => {
    Axios.get('/contentItems')
      .then(({ data }) => {
        const { navItemList, navItems, mainContentHeadings, diveDeeperCards } = data;
        setNavItemList(navItemList);
        setNavItems(navItems);
        setMainContentHeadings(mainContentHeadings);
        setDiveDeeperCards(diveDeeperCards);
        setMainContentItem(mainContentHeadings[window.location.pathname]);
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      });
  };

  if (error) {
    return (<h1>An error has occurred, try again later</h1>);
  } else if (!mainContentItem) {
    return (
      <div>
        loading..
        {/* <img /> */}
      </div>
    );
  } else {
    const route = window.location.pathname;
    const mainContentHeading = mainContentHeadings[route];

    const routes = [
      {
        path: '/',
        exact: true,
        component: () => (
          <MainContentWelcome
            mainContentHeading={mainContentHeading}
            diveDeeperCards={diveDeeperCards}
          />
        )
      },
      {
        path: route,
        exact: true,
        component: () => (
          <MainContentOther
            mainContentHeading={mainContentHeading}
          />
        )
      }
    ];

    return (
      <Router>
        <div>
          <TopBar />
          <SidebarNavigation
            navItemList={navItemList}
            navItems={navItems}
            setMainContentItem={setMainContentItem}
          />
          <Switch>
            {routes.map((route, index) => {
              const { path, exact } = route;
              return (
                <Route
                  key={index}
                  path={path}
                  exact={exact}
                  children={<route.component />}
                />
              );
            })}
          </Switch>
        </div>
      </Router>
    );
  }
};

export default App;