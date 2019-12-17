using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class BirthCertificateIdIsRequired : Required<Child>
  {
    public BirthCertificateIdIsRequired() : base("BirthCertificateId")
    {}
  }  
}