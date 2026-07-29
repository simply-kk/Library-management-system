package com.PageFlow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.PageFlow.dto.IssueBookRequest;
import com.PageFlow.dto.ResponseStructure;
import com.PageFlow.entity.IssueRecord;
import com.PageFlow.service.IssueRecordService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/issues")
public class IssueRecordController {

    @Autowired
    private IssueRecordService issueRecordService;

    // Issue a book
    @PostMapping
    public ResponseEntity<ResponseStructure<IssueRecord>> issueBook(
            @Valid @RequestBody IssueBookRequest request) {

        ResponseStructure<IssueRecord> res = new ResponseStructure<>();

        res.setStatusCode(HttpStatus.CREATED.value());
        res.setMessage("Book issued successfully.");
        res.setData(issueRecordService.issueBook(request));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    // Return an issued book
    @PutMapping("/{issueId}/return")
    public ResponseEntity<ResponseStructure<IssueRecord>> returnBook(
            @PathVariable Integer issueId) {

        ResponseStructure<IssueRecord> res = new ResponseStructure<>();

        res.setStatusCode(HttpStatus.OK.value());
        res.setMessage("Book returned successfully.");
        res.setData(issueRecordService.returnBook(issueId));

        return ResponseEntity.ok(res);
    }
}