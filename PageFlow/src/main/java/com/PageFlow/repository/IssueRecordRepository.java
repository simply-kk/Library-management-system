package com.PageFlow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.PageFlow.entity.IssuedRecord;

public interface IssueRecordRepository extends JpaRepository<IssuedRecord, Integer> {

}