using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SharpKml;

namespace kmlparser_app.Controllers
{
    [ApiController]
    [Route("kmlParser")]
    public class KmlParserController : ControllerBase
    {
        private readonly ILogger<KmlParserController> _logger;

        public KmlParserController(ILogger<KmlParserController> logger)
        {
            _logger = logger;
        }

        [HttpPost("parseKml")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public StatusCodeResult ParseKML([FromForm] IFormFile kmlFile)
        {
            string type = kmlFile.ContentType;
            string fileName = kmlFile.FileName;
            return null;
        }
    }
}
