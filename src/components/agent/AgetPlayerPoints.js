import { Container, Divider, Grid, Typography, TextField, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useHistory } from 'react-router';
import { authenticationService } from '../../services/authenticationService';
import settings from '../../settings';
import adapter from '../../utils/adapter';
import Navbar from '../common/Navbar';

const fetchPlayerPoints = async (currentPlayer) => {
    const url = `${settings.apiRoot}/api/v1/transaction/balance/${currentPlayer.id}`;
    const response = await adapter.Get(url);
    if (response.ok) {
        const jsonResponse = await response.json();
        return (jsonResponse.data.balance);
    }
    return 0;
}

export default function AgentPlayerPoints() {
    const [userDetail, setUserDetail] = useState('');
    const [currentPlayer, setCurrentPlayer] = useState('');
    const [currentPlayerPoints, setCurrentPlayerPoints] = useState(0);
    const history = useHistory();
    const [pointsToAdd, setPointsToAdd] = useState(0);
    const [confirmPointsToAdd, setConfirmPointsToAdd] = useState(0);
    const [pointsToAddError, setPointsToAddError] = useState('');
    const [confirmPointsToAddError, setConfirmPointsToAddError] = useState('');
    const [pointsToClaim, setPointsToClaim] = useState(0);
    const [confirmPointsToClaim, setConfirmPointsToClaim] = useState(0);
    const [pointsToClaimError, setPointsToClaimError] = useState('');
    const [confirmPointsToClaimError, setConfirmPointsToClaimError] = useState('');
    const [fetchingPlayerPoints, setFetchingPlayerPoints] = useState(false);
    const [submittingPointsToAdd, setSubmittingPointsToAdd] = useState(false);
    const [submittingPointsToClaim, setSubmittingPointsToClaim] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const currentUser = authenticationService.getCurrentUser();
            setUserDetail(currentUser)

            const currentPlayer = JSON.parse(sessionStorage.getItem('agent-player-points'));
            setCurrentPlayer(currentPlayer);

            setFetchingPlayerPoints(true);
            const balance = await fetchPlayerPoints(currentPlayer);
            setFetchingPlayerPoints(false);
            setCurrentPlayerPoints(balance);

        }

        fetchData();
    }, []);


    const handleAddPoints = async (e) => {
        e.preventDefault();

        const isValid = await validateAddPoints();

        if (isValid) {
            const url = `${settings.apiRoot}/api/v1/transaction`;
            const data = {
                operatorId: currentPlayer.operatorId,
                userId: currentPlayer.id,
                userType: "Player",
                transactionType: "WalletDebit",
                amount: confirmPointsToAdd
            }

            setSubmittingPointsToAdd(true);
            const response = await adapter.Post(url, data);
            setSubmittingPointsToAdd(false);

            if (response.ok) {
                setFetchingPlayerPoints(true);
                const newBalance = await fetchPlayerPoints(currentPlayer);
                setFetchingPlayerPoints(false);
                setCurrentPlayerPoints(newBalance);
            }

            setPointsToAdd(0);
            setConfirmPointsToAdd(0);
        }
    }

    const validateAddPoints = async () => {
        const maxPointsToAdd = 300;
        let pointsToAddError = "";
        let confirmPointsToAddError = ""

        if (!pointsToAdd || pointsToAdd === 0) {
            pointsToAddError = "Points to add is required.";
        }

        if (isNaN(pointsToAdd)) {
            pointsToAddError = "Points to add must be a number.";
        }

        if (pointsToAdd > maxPointsToAdd) {
            pointsToAddError = `Points to add cannot be greater than ${maxPointsToAdd}.`;
        }

        if (!confirmPointsToAdd || confirmPointsToAdd === 0) {
            confirmPointsToAddError = "Confirm points to add is required.";
        }

        if (isNaN(confirmPointsToAdd)) {
            confirmPointsToAddError = "Confirm points to add must be a number."
        }

        if (confirmPointsToAdd !== pointsToAdd) {
            confirmPointsToAddError = "Confirm points to add does not match provided points to add.";
        }


        if (pointsToAddError !== '' || confirmPointsToAddError !== '') {
            setPointsToAddError(pointsToAddError);
            setConfirmPointsToAddError(confirmPointsToAddError);
            return false;
        }

        return true;
    }

    const handleClaimPoints = async (e) => {
        e.preventDefault();

        const isValid = validatePointsToClaim();

        if (isValid) {
            const url = `${settings.apiRoot}/api/v1/transaction`;
            const data = {
                operatorId: currentPlayer.operatorId,
                userId: currentPlayer.id,
                userType: "Player",
                transactionType: "WalletCredit",
                amount: confirmPointsToClaim
            }

            setSubmittingPointsToClaim(true);
            const response = await adapter.Post(url, data);
            setSubmittingPointsToClaim(false);

            if (response.ok) {
                setFetchingPlayerPoints(true);
                const newBalance = await fetchPlayerPoints(currentPlayer);
                setFetchingPlayerPoints(false);
                setCurrentPlayerPoints(newBalance);
            }

            setPointsToClaim(0);
            setConfirmPointsToClaim(0);
        }
    }

    const validatePointsToClaim = () => {
        const maxPointsToClaim = currentPlayerPoints;
        let pointsToClaimError = "";
        let confirmPointsToClaimError = "";


        if (!pointsToClaim || pointsToClaim === 0) {
            pointsToClaimError = "Points to claim is required.";
        }

        if (isNaN(pointsToClaim)) {
            pointsToClaimError = "Points to claim must be a number.";
        }

        if (pointsToClaim > maxPointsToClaim) {
            pointsToClaimError = `Points to claim cannot be greater than ${maxPointsToClaim}.`;
        }

        if (!confirmPointsToClaim || confirmPointsToClaim === 0) {
            confirmPointsToClaimError = "Confirm points to claim is required.";
        }

        if (isNaN(confirmPointsToClaim)) {
            confirmPointsToClaimError = "Confirm points to claim must be a number";
        }

        if (confirmPointsToClaim !== pointsToClaim) {
            confirmPointsToClaimError = "Confirm points to claim does not match provided points to claim.";
        }

        if (pointsToClaimError !== "" || confirmPointsToClaimError !== "") {
            setPointsToClaimError(pointsToClaimError);
            setConfirmPointsToClaimError(confirmPointsToClaimError);
            return false;
        }

        return true;
    }

    return (
        <div>
            <Navbar userType={userDetail.role} title={"Player Points"} />
            <Container maxWidth="md">
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Typography variant="subtitle1" style={{ textAlign: 'left', flexGrow: 1 }}>Player Name: {currentPlayer.userName}</Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Typography
                            variant="subtitle1"
                            style={{ textAlign: 'left', flexGrow: 1 }}>
                            Points: {fetchingPlayerPoints ? <FaSpinner className="spinner" /> : currentPlayerPoints}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider variant="fullWidth" />
                <form onSubmit={handleAddPoints}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            style={{ marginTop: '20px' }}
                            fullWidth id="outlined-basic"
                            label="Points to Add"
                            variant="outlined"
                            onChange={(e) => { setPointsToAdd(e.target.value); setPointsToAddError("") }}
                            value={pointsToAdd}
                            error={pointsToAddError !== ""}
                            helperText={pointsToAddError} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            style={{ marginTop: '20px' }}
                            fullWidth id="outlined-basic"
                            label="Confirm Points to Add"
                            variant="outlined"
                            onChange={(e) => { setConfirmPointsToAdd(e.target.value); setConfirmPointsToAddError("") }}
                            value={confirmPointsToAdd}
                            error={confirmPointsToAddError !== ""}
                            helperText={confirmPointsToAddError} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            style={{ marginTop: '50px' }}
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={submittingPointsToAdd}
                            startIcon={submittingPointsToAdd && <FaSpinner className="spinner" />}>Add Points</Button>
                    </Grid>
                </form>
                <Divider variant="fullWidth" style={{ marginTop: '20px' }} />
                <form onSubmit={handleClaimPoints}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            style={{ marginTop: '20px' }}
                            fullWidth id="outlined-basic"
                            label="Points to Claim"
                            variant="outlined"
                            onChange={(e) => { setPointsToClaim(e.target.value); setPointsToClaimError("") }}
                            value={pointsToClaim}
                            error={pointsToClaimError !== ""}
                            helperText={pointsToClaimError}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            style={{ marginTop: '20px' }}
                            fullWidth id="outlined-basic"
                            label="Confirm Points to Claim"
                            variant="outlined"
                            onChange={(e) => { setConfirmPointsToClaim(e.target.value); setConfirmPointsToClaimError("") }}
                            value={confirmPointsToClaim}
                            error={confirmPointsToClaimError !== ""}
                            helperText={confirmPointsToClaimError} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button style={{ marginTop: '50px' }}
                            fullWidth variant="contained"
                            color="primary"
                            type="submit"
                            disabled={submittingPointsToClaim}
                            startIcon={submittingPointsToClaim && <FaSpinner className="spinner" />}>Claim Points</Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button style={{ marginTop: '50px' }} fullWidth variant="outlined" onClick={() => history.push('/agent')}>Back</Button>
                    </Grid>
                </form>
            </Container>
        </div>
    )
}

