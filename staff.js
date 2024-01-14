app.post('/Staff/viewReport', (req, res) => {
    const { staff_id, date } = req.body;

    try {
       
        const reportData = await view.viewReport(client, staff_id, date);
        console.log(reportData);
        return res.status(200).json({ data: reportData, message: "Successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post('/Staff/StudentList', (req, res) => {});


app.post('/Staff/viewDetails', (req, res) => {});



