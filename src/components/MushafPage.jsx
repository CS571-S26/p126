function MushafPage({ pageNumber, showTranslation, children }) {
  return (
    <div id={`mushaf-page-${pageNumber}`} className={`mushaf-page${showTranslation ? " mushaf-bilingual" : ""}`}>
      {children}
      <div className="page-number">{pageNumber}</div>
    </div>
  );
}

export default MushafPage;
