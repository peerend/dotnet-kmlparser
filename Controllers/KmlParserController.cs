using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SharpKml.Base;
using SharpKml.Dom;
using MaxRev.Gdal.Core;
using Microsoft.AspNetCore.SpaServices.Extensions;

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
            GdalBase.ConfigureAll();
        }

        [HttpPost("parseKml")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<StatusCodeResult> ParseKML([FromForm] IFormFile kmlFile)
        {
            //This functionality relies on the sharpkml package 
            //https://github.com/samcragg/sharpkml
            string type = kmlFile.ContentType;
            string fileName = kmlFile.FileName;
            string kmlString = await ReadAsStringAsync(kmlFile);
            Parser parser = new Parser();
            
            parser.ParseString(kmlString, false);
            Kml kml = parser.Root as Kml;
            Document document = kml.Feature as Document;
            List<Feature> features = document.Features.ToList();
            var featureChildren = features[0].Children;
            var childList = featureChildren.ToList();
            
            return null;
            
        }

        [HttpPost("GdalParseKML")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<StatusCodeResult> GdalParseKML([FromForm] IFormFile kmlFile)
        {
            
            return null;
        }

        private static async Task<string> ReadAsStringAsync(IFormFile file)
        {
            StringBuilder result = new StringBuilder();
            using (StreamReader reader = new StreamReader(file.OpenReadStream()))
            {
                while (reader.Peek() >= 0)
                {
                    result.AppendLine(await reader.ReadLineAsync());
                }
            }
            return result.ToString();
        }

        // private static StreamReader ParseKmlStream(IFormFile file)
        // {
        //     // Parser parser = new Parser();
        //     Parser parser = new Parser();
        //     var result = parser.Parse(file.OpenReadStream());
        // }
    }
}
