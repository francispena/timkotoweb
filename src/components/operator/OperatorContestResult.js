import { TextField, Button, Container, Dialog, DialogContent, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@material-ui/core";
import { useEffect, useState } from "react";
import { authenticationService } from "../../services/authenticationService"
import settings from "../../settings";
import adapter from "../../utils/adapter";
import LoadingTable from "../common/LoadingTable";
import Navbar from "../common/Navbar";
import { useHistory } from "react-router";

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
    tableRow: {
        height: 30
    },
    tableCell: {
        padding: "1px 6px"
    },
    tableHead: {
        padding: "1px 6px",
        backgroundColor: "#5353c6",
        color: "white"
    }
});
export default function OperatorContestResult() {
    const classes = useStyles();
    const history = useHistory();
    const currentUser = authenticationService.getCurrentUser();
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
    const [contestResult, setContestResult] = useState({});
    const [fetchingContestResult, setFetchingContestResult] = useState(false);
    const [showTeamStats, setShowTeamStats] = useState(false);
    const [teamStats, setTeamStats] = useState({});
    const [loadingTeamStats, setLoadingTeamStats] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState({});

    useEffect(() => {        
        setContestResult({});
        FetchContentResult();
    }, [currentDate]);

    async function FetchContentResult() {
        if (currentDate !== "") {
            setFetchingContestResult(true);
            const url = `${settings.apiRoot}/api/v1/contest/teamhistoryranks/${currentUser.id}/${currentDate}`;
            const response = await adapter.Get(url);            

            if (response.ok) {
                const jsonResponse = await response.json();
                setContestResult(jsonResponse.data.teamRankPrizes);
            }
            setFetchingContestResult(false);
        }
    }

    const handleTeamRankTeamClick = (team) => {
        const selectedTeam = {
            id: team.playerTeamId,
            score: team.score,
            teamRank: team.teamRank,
            teamName: team.teamName
        };
        showStats(selectedTeam);
    }

    const showStats = async (team) => {
        if (team.id === undefined) {
            return;
        }
        setSelectedTeam(team);
        setShowTeamStats(true);

        setLoadingTeamStats(true);
        const url = `${settings.apiRoot}/api/v1/player/teamplayerstats/${team.id}`;
        const response = await adapter.Get(url);

        if (response.ok) {
            const jsonResponse = await response.json();
            setTeamStats(jsonResponse.data.playerStats);
        }
        setLoadingTeamStats(false);
    }

    const formatNumber = (num) => {
        if (num == undefined  || num == '' || isNaN(num)) return '0.00'
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        <div className={classes.root}>
            <Navbar userType={currentUser.role} title="Contest Result" />
            <Container maxWidth="xs" >
                <Grid container className="container-style">
                    <Grid item xs={12} md={12}>
                        <form>
                            <span style={{fontWeight: 'bold'}}>Date of Contest :</span>
                        <TextField
                                id="date"
                                type="date"
                                defaultValue={currentDate}
                                onChange={(e) => setCurrentDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        {fetchingContestResult ? <LoadingTable /> :
                            <TableContainer className={classes.container} style={{marginTop: '20px'}}>
                                <Table stickyHeader className="table-style" className={classes.container}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" className={classes.tableHead}>Name</TableCell>
                                            <TableCell align="center" className={classes.tableHead}>Rank - Score</TableCell>
                                            <TableCell align="right" className={classes.tableHead}>Prize</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            contestResult.length > 0 ?
                                                contestResult.map((result, index) => (
                                                    <TableRow style={{ cursor: 'pointer' }} hover key={index} onClick={() => handleTeamRankTeamClick(result)}>
                                                        <TableCell align="left" className={classes.tableCell}>{result.teamName}</TableCell>
                                                        <TableCell align="center" className={classes.tableCell}>{result.teamRank} - {formatNumber(result.score)}</TableCell>                                                        
                                                        <TableCell align="right" className={classes.tableCell}>{formatNumber(result.prize)}</TableCell>
                                                    </TableRow>
                                                )) :
                                                <TableRow hover>
                                                    <TableCell colSpan="5" align="center">No Data</TableCell>
                                                </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }
                    </Grid>
                    <Grid item xs={12} md={12} className="generate-button-container">
                        <Button variant="contained" onClick={() => history.push('/operator')} fullWidth color='primary'  size='small'>Home</Button>
                    </Grid>
                </Grid>
            </Container>
            <Dialog open={showTeamStats} fullWidth>
                <DialogContent style={{ textAlign: 'center', fontSize: '25px' }}>
                    <Grid container className='container-style'>
                        <Grid item xs={12} md={12} className="summary-container" style={{ marginBottom: '10px' }}>
                            <p>Score : <span style={{ fontWeight: 'bold' }}>{selectedTeam.score}</span></p>
                            <p>Rank : <span style={{ fontWeight: 'bold' }}>{selectedTeam.teamRank}</span></p>
                        </Grid>
                        <Grid item xs={12} md={12} style={{ align: 'center' }} style={{ marginTop: '10px' }}>
                            <Typography variant="h6" style={{ textAlign: 'center', flexGrow: 1 }}>{selectedTeam.teamName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            {loadingTeamStats ? <LoadingTable /> :
                                <TableContainer className={classes.container} style={{ marginTop: '10px' }}>
                                    <Table stickyHeader className="table-style" className={classes.container}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left" className={classes.tableHead}>Name</TableCell>
                                                <TableCell align="right" className={classes.tableHead}>P</TableCell>
                                                <TableCell align="right" className={classes.tableHead}>R</TableCell>
                                                <TableCell align="right" className={classes.tableHead}>A</TableCell>
                                                <TableCell align="right" className={classes.tableHead}>S</TableCell>
                                                <TableCell align="right" className={classes.tableHead}>B</TableCell>
                                                <TableCell align="right" className={classes.tableHead}>T</TableCell>
                                                <TableCell align="right" className={classes.tableHead}>TS</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                teamStats.length > 0 ?
                                                    teamStats.map((teamStats, index) => (
                                                        <TableRow style={{ cursor: 'default' }} key={index} >
                                                            <TableCell align="left" className={classes.tableCell}>{teamStats.playerName}</TableCell>
                                                            <TableCell align="right" className={classes.tableCell}>{teamStats.points}</TableCell>
                                                            <TableCell align="right" className={classes.tableCell}>{formatNumber(teamStats.rebounds)}</TableCell>
                                                            <TableCell align="right" className={classes.tableCell}>{formatNumber(teamStats.assists)}</TableCell>
                                                            <TableCell align="right" className={classes.tableCell}>{teamStats.steals}</TableCell>
                                                            <TableCell align="right" className={classes.tableCell}>{teamStats.blocks}</TableCell>
                                                            <TableCell align="right" className={classes.tableCell}>{teamStats.turnOvers}</TableCell>
                                                            <TableCell align="right" className={classes.tableCell}>{formatNumber(teamStats.totalPoints)}
                                                            </TableCell>
                                                        </TableRow>
                                                    )) :
                                                    <TableRow hover>
                                                        <TableCell colSpan="5" align="center">No Data</TableCell>
                                                    </TableRow>
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            }
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Button variant="contained" style={{ margin: '20px 0px' }} fullWidth onClick={() => setShowTeamStats(false)} size='small' color='primary'>Close</Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    )
}