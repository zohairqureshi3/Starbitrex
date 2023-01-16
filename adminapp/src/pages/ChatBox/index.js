import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward, faMarsAndVenus, faMessage, faMicrophone, faSearch, faSmile } from '@fortawesome/free-solid-svg-icons';

const Index = () => {
    return (
        <>
            <div className="chatbox-container">
                <div className="d-flex h-100">




                    <div className="chat-profile-container border-right pe-0">


                        <div className="settings-tray">
                            <img className="profile-image"
                                src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/filip.jpg" alt="Profile img" />
                            <span className="settings-tray--right">
                            </span>
                        </div>


                        <div className="search-box">
                            <div className="input-wrapper">
                                <FontAwesomeIcon className="material-icons" icon={faSearch} />
                                <input placeholder="Search here" type="text" />
                            </div>
                        </div>

                        <div className="friend-drawer friend-drawer--onhover">
                            <img className="profile-image"
                                src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg" alt="" />
                            <div className="text">
                                <h6>Robo Cop</h6>
                                <p className="text-muted">Hey, you're arrested!</p>
                            </div>
                            <span className="time text-muted small">13:21</span>
                        </div>
                        <hr />


                        <div className="friend-drawer friend-drawer--onhover">
                            <img className="profile-image"
                                src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/optimus-prime.jpeg" alt="" />
                            <div className="text">
                                <h6>Optimus</h6>
                                <p className="text-muted">Wanna grab a beer?</p>
                            </div>
                            <span className="time text-muted small">00:32</span>
                        </div>
                        <hr />

                        <div className="friend-drawer friend-drawer--onhover ">
                            <img className="profile-image"
                                src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/real-terminator.png" alt="" />
                            <div className="text">
                                <h6>Skynet</h6>
                                <p className="text-muted">Seen that canned piece of s?</p>
                            </div>
                            <span className="time text-muted small">13:21</span>
                        </div>
                        <hr />

                        <div className="friend-drawer friend-drawer--onhover">
                            <img className="profile-image"
                                src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/termy.jpg" alt="" />
                            <div className="text">
                                <h6>Termy</h6>
                                <p className="text-muted">Im studying spanish...</p>
                            </div>
                            <span className="time text-muted small">13:21</span>
                        </div>
                        <hr />

                        <div className="friend-drawer friend-drawer--onhover">
                            <img className="profile-image"
                                src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/rick.jpg" alt="" />
                            <div className="text">
                                <h6>Richard</h6>
                                <p className="text-muted">I'm not sure...</p>
                            </div>
                            <span className="time text-muted small">13:21</span>
                        </div>

                        <hr />
                        <div className="friend-drawer friend-drawer--onhover">
                            <img className="profile-image"
                                src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/rachel.jpeg" alt="" />
                            <div className="text">
                                <h6>ABD</h6>
                                <p className="text-muted">Hi, wanna see something?</p>
                            </div>
                            <span className="time text-muted small">13:21</span>
                        </div>






                    </div>






                    <div className="chat-text-container ps-0 h-100">



                        <div className="settings-tray">
                            <div className="friend-drawer no-gutters friend-drawer--grey">
                                <img className="profile-image"
                                    src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg" alt="" />
                                <div className="text">
                                    <h6>Robo Cop</h6>
                                    <p className="text-muted">Layin' down the law since like before Christ...</p>
                                </div>
                            </div>
                        </div>




                        <div className="chat-panel">

                            <div className='chat-messages'>
                                <div className="chat-bubble chat-bubble--left">
                                    Hello dude!
                                </div>

                                <div className="chat-bubble chat-bubble--right">
                                It’s no surprise—
                                </div>


                                <div className="chat-bubble chat-bubble--right">
                                    All customers want to be served quickly, efficiently, and, preferably, with a personal touch.
                                </div>

                                <div className="chat-bubble chat-bubble--left">
                                    Impossible?
                                </div>

                                <div className="chat-bubble chat-bubble--left">
                                Not with live chat scripts.
                                </div>


                                <div className="chat-bubble chat-bubble--left">
                                Hi [customer name]! Awesome to see you again. Hit me up if you still need to clarify some things about [the issue the customer previously had].
                                </div>


                                <div className="chat-bubble chat-bubble--right">
                                What a pleasant surprise! Please remember I’m still here to help you out if you need anything.
                                </div>
                                <div className="chat-bubble chat-bubble--right">
                                Welcome back! Did you want to pick up where you left off last time?
                                </div>
                                <div className="chat-bubble chat-bubble--left">
                                Hi there! I’m just checking your previous issue is all sorted now. Feel free to ask me anything.
                                </div>
                                <div className="chat-bubble chat-bubble--right">
                                Welcome back at [name of your website]! Let me know if you want to add anything. 
                                </div>
                                <div className="chat-bubble chat-bubble--left">
                                Hi! Long time no see. Feel free to let me know if you need assistance today.
                                </div>
                                <div className="chat-bubble chat-bubble--left">
                                Hi there! Did you face any problems with the [earlier issue] again? I’m here to help.
                                </div>
                                <div className="chat-bubble chat-bubble--right">
                                    Hello dude!
                                </div>
                                <div className="chat-bubble chat-bubble--right">
                                Hello, I noticed you’re here for a while. Would you like me to go through our pricing plans?
                                </div>
                                <div className="chat-bubble chat-bubble--left">
                                    Hello dude!
                                </div>
                                <div className="chat-bubble chat-bubble--right">
                                Hi, I noticed you struggle to finalize your purchase. Can I explain our current offer?
                                </div>
                                <div className="chat-bubble chat-bubble--left">
                                    Hello dude!
                                </div>
                                <div className="chat-bubble chat-bubble--right">
                                    Hello dude!
                                </div>
                                <div className="chat-bubble chat-bubble--right">
                                    Hello dude!
                                </div>
                            </div>


                            <div className="chat-box-tray">
                                <FontAwesomeIcon className="svg" icon={faSmile} />
                                <input type="text" placeholder="Type your message here..." />
                                <FontAwesomeIcon className="svg me-3" icon={faMicrophone} />
                                <FontAwesomeIcon className="svg" icon={faForward} />
                            </div>
                        </div>









                    </div>















                </div>
            </div>
        </>
    )
}

export default Index