<div className="container">
  <h3 className="mt-4 mb-4">Upload Mis Document</h3>
  <Row>
    <Col md="6 text-left">
      <FormGroup>
        <Input
          id="inputEmpGroupFile"
          name="file"
          type="file"
          disabled={loading}
          onChange={readUploadFile}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
        <FormText>
          {"NOTE: The headers in the Excel file should be as follows!. => "}
          {requiredFields.join(", ")}
        </FormText>
      </FormGroup>
    </Col>
    <Col md="6 text-left">
      {selectedFile?.name && excelRows.length ? (
        <Button disabled={loading} color="success" onClick={uploadData}>
          {"Upload data"}
        </Button>
      ) : null}{" "}
      {selectedFile?.name && excelRows.length ? (
        <Button disabled={loading} color="danger" onClick={removeFile}>
          {"Remove file"}
        </Button>
      ) : null}
    </Col>
  </Row>
</div>;
