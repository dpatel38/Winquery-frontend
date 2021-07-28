import React, { Component } from 'react';
import { getAllPolls, getUserCreatedPolls, getUserVotedPolls } from '../util/APIUtils';
import Poll from './Poll';
import { castVote, deletePoll } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon, notification } from 'antd';
import { POLL_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './PollList.css';

class PollList extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            polls: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            isLoading: false
        };
        this.loadPollList = this.loadPollList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadPollList(page = 0, size = POLL_LIST_SIZE) {
        let promise;
        if(this.props.username) {
            if(this.props.type === 'USER_CREATED_POLLS') {
                promise = getUserCreatedPolls(this.props.username, page, size);
            } else if (this.props.type === 'USER_VOTED_POLLS') {
                promise = getUserVotedPolls(this.props.username, page, size);                               
            }
        } else {
            promise = getAllPolls(page, size);
        }

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise            
        .then(response => {
            const polls = this.state.polls.slice();
            const currentVotes = this.state.currentVotes.slice();

            if(this._isMounted){
                this.setState({
                    polls: polls.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    currentVotes: currentVotes.concat(Array(response.content.length).fill(null)),
                    isLoading: false
                })
            }
           
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
    }

    componentDidMount() {
        this._isMounted = true;
        
            this.loadPollList();
        
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                polls: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                currentVotes: [],
                isLoading: false
            });    
            this.loadPollList();
        }
    }


    handleLoadMore() {
        this.loadPollList(this.state.page + 1);
    }

    handleVoteChange(event, pollIndex) {
        const currentVotes = this.state.currentVotes.slice();
        currentVotes[pollIndex] = event.target.value;

        this.setState({
            currentVotes: currentVotes
        });
    }


    handleVoteSubmit(event, pollIndex) {
        event.preventDefault();
        if(!this.props.isAuthenticated) {
            this.props.history.push("/login");
            notification.info({
                message: 'Winquiry App',
                description: "Please login to vote.",          
            });
            return;
        }

        const poll = this.state.polls[pollIndex];
        const selectedChoice = this.state.currentVotes[pollIndex];

        const voteData = {
            pollId: poll.id,
            choiceId: selectedChoice
        };

        castVote(voteData)
        .then(response => {
            const polls = this.state.polls.slice();
            polls[pollIndex] = response;
            this.setState({
                polls: polls
            });        
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login to vote');    
            } else {
                notification.error({
                    message: 'Winquiry App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });                
            }
        });
    }

    // delete a single poll
    deleteSinglePoll = (id) => {

        deletePoll(id)
        .then(res => {
            console.log(res);
            notification.success({
                message: 'Winquiry App',
                description: "Winquiry deleted!",          
            });

            // console.log(this.state);

            this.setState({
                polls: this.state.polls.filter((poll) => poll.id !== id)
            });

           
            
        }).catch(err => {
            console.log(err);
            notification.error({
                message: 'Winquiry App',
                description: "An error occurred!",          
            });
            // this.loadPollList();
        });
       
    }

    render() {
        const pollViews = [];
        this.state.polls.forEach((poll, pollIndex) => {
            pollViews.push(
            
            <Poll 
                key={poll.id} 
                poll={poll}
                currentVote={this.state.currentVotes[pollIndex]} 
                handleVoteChange={(event) => this.handleVoteChange(event, pollIndex)}
                handleVoteSubmit={(event) => this.handleVoteSubmit(event, pollIndex)} 
                currentLoggedInUser={this.props.currentUser}
                deletePoll={this.deleteSinglePoll}
                history={this.props.history}
            />
            
            )            
        });

        return (
            <div className="polls-container">
                {pollViews}
                {
                    !this.state.isLoading && this.state.polls.length === 0 ? (
                        <div className="no-polls-found">
                            <span>No Winquiry Found.</span>
                        </div>    
                    ): null
                }  
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-polls"> 
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }              
                {
                    this.state.isLoading ? 
                    <LoadingIndicator />: null                     
                }
            </div>
        );
    }
}

export default withRouter(PollList);
