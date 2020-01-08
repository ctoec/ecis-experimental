using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class IfC4K_CertificateStartDateRequired : ConditionalFieldRequired<Funding>
  {
    public IfC4K_CertificateStartDateRequired()
      : base("source is Care 4 Kids", "CertificateStartDate", "Certificate start date")
    { }

    protected override bool CheckCondition(Funding entity)
    {
      return entity.Source == FundingSource.C4K;
    }
  }
}