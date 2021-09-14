import React from 'react';
import { Grid, Row, Col } from 'rsuite';
import { Switch, Route, useRouteMatch } from 'react-router';
import {RoomProvider} from "../../context/rooms.context";
import Sidebar from '../../components/Sidebar';
import Chat from './Chat';
import { useMediaQuery } from '../../misc/custom-hooks';

const Home = () => {
    const isDesktop = useMediaQuery('(min-width: 992px)');
    const { isExact } = useRouteMatch();

    const canRenderSidebar = isDesktop || isExact;

    return (
        <RoomProvider>
            <Grid fluid className="h-100">
                <Row className="h-100">
                    {canRenderSidebar && (
                        <Col xs={24} md={8} className="h-100">
                            <Sidebar />
                        </Col>
                    )}

                    <Switch>
                        <Route exact path="/chat/:chatId">
                            <Col xs={24} md={16} className="h-100">
                                <Chat />
                            </Col>
                        </Route>
                        <Route>
                            {isDesktop && (
                                <Col xs={24} md={16} className="h-100">
                                    <h6 className="text-center mt-page">Please select chat</h6>
                                </Col>
                            )}
                        </Route>
                    </Switch>
                </Row>
            </Grid>
        </RoomProvider>
    );
};

export default Home;