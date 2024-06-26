import React, { useState, useEffect } from 'react'
import Navbar from '../common/Navbar';
import '../css/Player.css';
import { Container, Grid, Button } from '@material-ui/core'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import settings from '../../settings';
import adapter from '../../utils/adapter'
import Divider from '@material-ui/core/Divider';
import { authenticationService } from '../../services/authenticationService';
import { useHistory } from 'react-router-dom';
import BackdropLoading from '../common/BackdropLoading';



export default function PlayerHomePage(){
    const history = useHistory()
    const [prizepool, setPrizepool] = useState([]);
    const [games, setGames] = useState([]);
    const [contest, setContest] = useState({});
    const [userType, setUserType] = useState('');
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false)
    const [playerName, setPlayerName] = useState(false)

    useEffect(()=>{
        setLoading(true)
        fetchHomePageData()
    },[])

    async function fetchHomePageData(){
        const user = await authenticationService.getCurrentUser()
        setPlayerName(user.userName);
        const url = `${settings.apiRoot}/api/v1/Player/GetHomePageData/${user.operatorId}/${user.id}`;
        const response = await adapter.Get(url)
        if (response.ok)
        {
            const jsonResponse = await response.json()
            setPrizepool(jsonResponse.data.prizePool)
            setGames(jsonResponse.data.teams)
            setContest(jsonResponse.data.contest)
            setBalance(jsonResponse.data.balance)
            const contest = JSON.stringify(jsonResponse.data.contest)
            sessionStorage.setItem("contest", contest)
        }
        if (response.status === 403){
            const jsonResponse = await response.json()
            if (jsonResponse != null && jsonResponse.data != null)
                {
                    setBalance(jsonResponse.data.balance)
                }
        }
        setLoading(false)
    }

    const formatNumber = (num) => {
        if (num == undefined || num =='' || isNaN(num)) return '0.00'
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    return(
        <div>
            <BackdropLoading open={loading} />
            <Navbar userType={"Player"} title={playerName + " - " + formatNumber(balance) + " pts."}/>
            <Container maxWidth="md">
                <Grid container justify="center" style={{marginTop: '30px'}}>
                    <Grid item xs={12} md={5}>
                        <List className="player-contest-list" style={{maxHeight: 250, backgroundColor: '#00001a'}} component="nav" aria-label="main mailbox folders">
                                {
                                    prizepool.length > 0 ?
                                    prizepool.map((prize, index) => (
                                        <ListItem button key={index} style={{maxHeight: 25,  marginTop: '5px'}}>
                                            <ListItemText style={{width: '50%'}}>
                                                <p align="right" style={{marginRight: "20px", color: 'white', fontWeight: 'bold'}} >{"Top "+ prize.displayRank}</p>
                                            </ListItemText>
                                            
                                            <ListItemText style={{width: '50%'}}>
                                                <p align="right"  style={{marginLeft: "20px", marginRight: "70px", color: 'gold', fontWeight: 'bold'}}>{prize.displayPrize}</p>
                                            </ListItemText>
                                        </ListItem>
                                    ))
                                    :
                                    <ListItem button>
                                            <ListItemText primary="No data"/>
                                    </ListItem>
                                }
                        </List>
                    </Grid>
                    <Grid item xs={12} md={12} style={{display: 'flex', justifyContent: 'center'}}>
                        <Grid container justify="center">
                            <Grid item xs={12} md={5}>
                                <Button 
                                 disabled={games.length === 0}
                                 fullWidth
                                 variant="contained"
                                 color="primary"
                                 style={{ margin: '10px 0px' }}
                                 onClick={()=> history.push('/player/create-team')}
                                 style={{marginTop: '30px'}}>Join Contest</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} style={{textAlign: 'center', padding: '10px', fontWeight: 'bold'}}>
                        Upcoming NBA Games on {contest.gameDate} (US Date)
                    </Grid>
                    <Grid item xs={12} md={12} style={{color: 'gray', fontSize:'11px', textAlign: 'center', padding: '0px'}}>
                        Start game time below are time in Ph.
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <List> 
                            <Divider />
                            {
                                games.length > 0 ?
                                games.map((game, index)=>(
                                    <>
                                    <ListItem key={index}>
                                        <Grid container style={{padding: '0 0px'}}>
                                            <Grid item xs={5} md={5} style={{textAlign: 'left', display: 'flex', justifyContent: 'space-between'}}>
                                                <div>
                                                    {game.homeTeamNickName}
                                                </div>
                                                <div>
                                                    <img src="../assets/teamLogo.png" alt="" style={{height: 50, width: 'auto'}}/>
                                                </div>
                                            </Grid>
                                            <Grid item xs={2} md={2} style={{color: 'gray', fontSize:'11px', textAlign: 'center', display: 'flex', justifyContent: 'center'}}>
                                                <p style={{margin: 'auto 0'}}>{game.startTime}</p>
                                            </Grid>
                                            <Grid item xs={5} md={5} style={{textAlign: 'right',display: 'flex', justifyContent: 'space-between'}}>
                                                <div>
                                                    <img src="../assets/teamLogo.png" alt="" style={{height: 50, width: 'auto'}}/>
                                                </div>
                                                <div>
                                                    {game.visitorTeamNickName}
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <Divider />
                                    </>
                                ))
                                :
                                <ListItem button>
                                    <ListItemText primary="No contest today."/>
                                </ListItem>
                            }
                        </List>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}