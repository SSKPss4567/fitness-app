import React from "react";
import classes from "./PaginationBar.module.css";

const PaginationBar = ({ currentPage = 1, totalPages, onPageChange }) => {
  console.log(totalPages);

  const pageNumbers = [];
  if (totalPages <= 1) {
    pageNumbers.push(1);
  } else {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  }

  console.log(pageNumbers);

  return (
    <div className={classes.paginationBar}>
      <button
        className={classes.pageButton}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          className={`${classes.pageButton} ${
            number === currentPage ? classes.active : ""
          }`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}
      <button
        className={classes.pageButton}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationBar;
