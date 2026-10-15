import React from 'react';
import Link from 'next/link';

function ErrorPage({ statusCode }) {
  const isNotFound = statusCode === 404;
  const heading = isNotFound ? 'Page not found' : 'Something went wrong';
  const body = isNotFound
    ? "The page you're looking for doesn't exist or has been moved."
    : 'An unexpected error has occurred. Please try again later.';

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center px-10 text-center">
      <p className="font-savoyBold text-xs uppercase tracking-widest text-gray mb-4">
        {statusCode || 'Error'}
      </p>
      <h1 className="font-savoyBold text-4xl mb-6">{heading}</h1>
      <p className="font-savoyRegular text-gray mb-8">{body}</p>
      <Link
        href="/"
        className="font-savoyBold text-xs uppercase tracking-widest underline"
      >
        Return to homepage
      </Link>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }) => {
  let statusCode = 404;
  if (res) {
    statusCode = res.statusCode;
  } else if (err) {
    statusCode = err.statusCode ?? 404;
  }
  return { statusCode };
};

export default ErrorPage;
