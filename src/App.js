import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//for responsive image loading
const imgbase = 'https://image.tmdb.org/t/p/';
const small = imgbase+'w154/';
const medium = imgbase+'w342/';
const large = imgbase+'w780/';
const original = imgbase+'original/';


class App extends Component {
  render() {
    return (
        <div className="App">
            <Navbar/>
            <header className="App-header">
                <Shows/>
            </header>
        </div>
    );
  }
}

class Shows extends Component {
  constructor(props) {
    super(props);
    this.state = {
        error: null,
        isLoaded: false,
        shows: []
    };
  }

  componentDidMount() {
    fetch("https://api.themoviedb.org/3/discover/tv?api_key=5c42d570e7ecb65d2dca1264e2f80e37&language=en-US&sort_by=popularity.desc&page=1&timezone=Asia%2FSingapore&include_null_first_air_dates=false")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    shows: result.results
                });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
  }

  render() {
    const { error, isLoaded, shows } = this.state;
    if (error) {
        return <div className="py-5">Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div className="py-5">Loading...</div>;
    } else {
        return (
            <Router>
                <div className="centered">
                    <Route path="/" exact render={()=> (
                        <div className="row main-container my-5">
                            {shows.map(item => (
                                <div key={item.id.toString()} className="col-6 col-sm-4 col-md-3 p-1">
                                    <Link to={`/tv/${item.id.toString()}`}>
                                        <img className="show-img my-1" sizes="(max-width: 575) 45vw, (max-width: 767) 26vw, 20vw" srcSet={small+item.poster_path+" 154w,"+ medium+item.poster_path+" 342w,"+large+item.poster_path+" 780w"} src={original+item.poster_path} alt={item.name}/>
                                    </Link>
                                </div>

                            ))}
                        </div>
                    )}/>
                    <Route path="/tv/:showId" component={Showpage}/>
                    <Route path="/season/:seasonId/:showId" component={Season}/>
                </div>
            </Router>
        );
    }
  }
}
//do a query to tv details
class Showpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            info: null
        };
    }
    componentDidMount() {
        fetch(`https://api.themoviedb.org/3/tv/${this.props.match.params.showId}?api_key=5c42d570e7ecb65d2dca1264e2f80e37&language=en-US`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        info: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
    render(){
        const { error, isLoaded, info } = this.state;
        if (error) {
            return <div className="py-5">Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div className="py-5">Loading...</div>;
        } else if (info){
            return (
                <div>
                    <div className="banner" style={{backgroundImage: `url(${original}${info.backdrop_path})`,zIndex: '-1'}}>
                        <div className="background-gradient">
                            <div className="row">
                                <div className="col-12 col-md-4 my-3">
                                    <img className="show-img" sizes="(max-width: 767) 90vw, 20vw" srcSet={small+info.poster_path+" 154w,"+ medium+info.poster_path+" 342w,"+large+info.poster_path+" 780w"} src={original+info.poster_path} alt={info.name}/>
                                </div>
                                <div className="col-12 col-md-8 text-left my-3">
                                    <a href={info.homepage}><h1>{info.name} <small>({info.first_air_date.slice(0,4)})</small></h1></a>
                                    <div>
                                        {info.genres.map(item => (
                                            <span key={item.id.toString()} className="badge badge-light mr-2">
                                                {item.name}
                                            </span>
                                        ))}
                                    </div>
                                    <Rating value={info.vote_average}/>
                                    <h5>Overview:</h5>
                                    <p>{info.overview}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h3 className="mt-3">Seasons</h3>
                    <div className="row justify-content-center">
                        {info.seasons.map(item => (

                            <div key={item.id.toString()} className="col-6 col-sm-4 col-md-3 card p-0 m-1">
                                <Link to={`/season/${item.season_number}/${this.props.match.params.showId}`}>
                                    {item.poster_path
                                        ? <img className="card-img-top" sizes="(max-width: 575) 45vw, (max-width: 767) 26vw, 20vw" srcSet={small+item.poster_path+" 154w,"+ medium+item.poster_path+" 342w,"+large+item.poster_path+" 780w"} src={original+item.poster_path} alt={item.name}/>
                                        : null
                                    }

                                    <div className="card-body py-2">
                                        <p class="card-text">{item.name}</p>
                                    </div>
                                </Link>
                            </div>

                        ))}
                    </div>
                </div>
            );
        }
        else {
            return (
                <div>No info is found.</div>
            );
        }
    }
}
// do a query for each season
class Season extends Component {
    constructor(props){
        super(props);
        this.state = {
            error:null,
            isLoaded :false,
            info:null
        }
    }
    componentDidMount() {
        fetch(`https://api.themoviedb.org/3/tv/${this.props.match.params.showId}/season/${this.props.match.params.seasonId}?api_key=5c42d570e7ecb65d2dca1264e2f80e37&language=en-US`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        info: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
    render(){
        const { error, isLoaded, info } = this.state;
        if (error) {
            return <div className="py-5">Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div className="py-5">Loading...</div>;
        } else if (info){
            return (
                <div>
                    {info.episodes.map(ep => (
                        <div className="row my-2 py-3 text-left white-container">
                            <div className="col-12 col-md-4">
                                {ep.still_path
                                    ?<img className="show-img" sizes="(max-width: 767) 90vw, 20vw" srcSet={small+ep.still_path+" 154w,"+ medium+ep.still_path+" 342w,"+large+ep.still_path+" 780w"} src={original+ep.still_path} alt={ep.name}/>
                                    :null
                                }
                                <p className="text-center">Episode {ep.episode_number}</p>
                            </div>
                            <div className="col-12 col-md-8">
                                <h5>{ep.name}</h5>
                                <Rating value={ep.vote_average}/>
                                <p>{ep.overview}</p>
                            </div>

                        </div>

                    ))}

                </div>
            );
        }
        else {
            return (
                <div>No info is found.</div>
            );
        }


    }
}

class Rating extends Component {
    render(){
        console.log(this.props.value);
        return (
            <div className="star-ratings-css">
                <div className="star-ratings-css-top" style={{width: `${(this.props.value)*10}%`}}><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                <div className="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span><span className="ml-3">{this.props.value}</span></div>
            </div>
        )
    }
}

class Trailer extends Component {

}

class Navbar extends Component {
    render() {
        return (
                <nav className="navbar navbar-dark justify-content-between" style={{backgroundColor: 'rebeccapurple'}}>
                    <a className="navbar-brand" href="/">hOOk</a>
                    {/*<form className=" my-2 my-lg-0 d-flex d-md-none">*/}
                        {/*<input className="form-control mr-2 my-auto" type="search" placeholder="Search" aria-label="Search"/>*/}
                        {/*<button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Go</button>*/}
                    {/*</form>*/}
                    {/*<form className="form-inline my-2 my-lg-0 d-none d-md-flex">*/}
                        {/*<input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>*/}
                        {/*<button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>*/}
                    {/*</form>*/}

                </nav>
        );
    }
}


export default App;
